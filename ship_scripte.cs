using System.Collections;
using System.Collections.Generic;
using System.Threading;
using WebSocketSharp;
using UnityEngine;

public class ship_scripte : MonoBehaviour {
    Rigidbody gamerigid;
    public Vector3 _dist;
    public GameObject _distObject;
    public string _belongto = "none";
   

    //WebSocket d = new WebSocket("ws://localhost:8080");
    // Use this for initialization
    void Start() {
        //initial socekt
       // d.Connect();
        gamerigid = GetComponent<Rigidbody>();
    }
    

    // Update is called once per frame
    void Update()
    {
        //so i can delete the object when he reach the dis
        Mathf.Pow(Vector3.Distance(transform.position, _dist),2);
        if (Mathf.Pow(Vector3.Distance(transform.position, _dist), 2) < 0.5f)
        {
            //Debug.Log("reached my dis");
            this.gameObject.active = false;
            //coumter
            if(_belongto=="me")
            {

                if(_distObject.GetComponent<Planet_scripte>()._forwhoisthisplanet=="none"||
                    _distObject.GetComponent<Planet_scripte>()._forwhoisthisplanet == "enemy")
                {
                    _distObject.GetComponent<Planet_scripte>()._ammo--;
                    if(_distObject.GetComponent<Planet_scripte>()._ammo==0)
                    {
                        _distObject.GetComponent<Planet_scripte>()._forwhoisthisplanet = _belongto;
                    }
                }
                else
                    _distObject.GetComponent<Planet_scripte>()._ammo++;

            }
            else
            {

                if (_distObject.GetComponent<Planet_scripte>()._forwhoisthisplanet == "none" ||
                    _distObject.GetComponent<Planet_scripte>()._forwhoisthisplanet == "me")
                {
                    _distObject.GetComponent<Planet_scripte>()._ammo--;
                    if (_distObject.GetComponent<Planet_scripte>()._ammo == 0)
                    {
                        _distObject.GetComponent<Planet_scripte>()._forwhoisthisplanet = _belongto;
                    }
                }
                else
                    _distObject.GetComponent<Planet_scripte>()._ammo++;

            }
           



        }

        //function for using lerp
        zaid();
        //for solving the merging shite
        gamerigid.constraints = RigidbodyConstraints.FreezePositionY;
        gamerigid.constraints = RigidbodyConstraints.FreezeRotationY;
        

        //d.OnMessage += (sender, e) =>
        // {
        //     Debug.Log("ssss");
        //     Debug.Log(e.Data);
        // };
    }
    void OnCollisionEnter(Collision other)
    {
        //no need to make it on enter 
        //gamerigid.constraints = RigidbodyConstraints.None;
       
    }
    private void OnCollisionExit(Collision collision)
    {
        gamerigid.constraints = RigidbodyConstraints.FreezePosition;
    }
    void zaid()
    {
        // d.Send("fuck");
        transform.position = Vector3.Lerp(transform.position, _dist, 2 * Time.deltaTime / Vector3.Distance(transform.position, _dist));

    }
}
